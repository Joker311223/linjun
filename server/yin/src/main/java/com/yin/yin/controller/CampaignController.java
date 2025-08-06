package com.yin.yin.controller;

import com.yin.yin.common.PageResult;
import com.yin.yin.common.Result;
import com.yin.yin.model.Campaign;
import com.yin.yin.model.CampaignStatus;
import com.yin.yin.model.CampaignType;
import com.yin.yin.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 活动控制器
 */
@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    /**
     * 获取活动列表
     */
    @GetMapping("/list")
    public Result<?> listCampaigns(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        PageResult<Campaign> pageResult = campaignService.listCampaigns(keyword, type, status, pageNum, pageSize);
        return Result.success(pageResult);
    }

    /**
     * 获取活动详情
     */
    @GetMapping("/detail/{id}")
    public Result<?> getCampaignDetail(@PathVariable Long id) {
        Campaign campaign = campaignService.getCampaignDetail(id);
        if (campaign != null) {
            return Result.success(campaign);
        } else {
            return Result.failed("活动不存在");
        }
    }

    /**
     * 获取活动类型
     */
    @GetMapping("/types")
    public Result<?> getCampaignTypes() {
        List<CampaignType> types = campaignService.getAllTypes();
        return Result.success(types);
    }

    /**
     * 获取活动状态
     */
    @GetMapping("/status")
    public Result<?> getCampaignStatus() {
        List<CampaignStatus> statusList = campaignService.getAllStatus();
        return Result.success(statusList);
    }

    /**
     * 添加活动
     */
    @PostMapping
    public Result<?> addCampaign(@RequestBody Campaign campaign) {
        int result = campaignService.addCampaign(campaign);
        if (result > 0) {
            return Result.success(null, "添加成功");
        } else {
            return Result.failed("添加失败");
        }
    }

    /**
     * 更新活动
     */
    @PutMapping("/{id}")
    public Result<?> updateCampaign(@PathVariable Long id, @RequestBody Campaign campaign) {
        campaign.setId(id);
        int result = campaignService.updateCampaign(campaign);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 删除活动
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteCampaign(@PathVariable Long id) {
        int result = campaignService.deleteCampaign(id);
        if (result > 0) {
            return Result.success(null, "删除成功");
        } else {
            return Result.failed("删除失败");
        }
    }
}
