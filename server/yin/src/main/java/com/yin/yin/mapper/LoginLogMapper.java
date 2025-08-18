package com.yin.yin.mapper;

import com.yin.yin.model.LoginLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 登录日志Mapper接口
 */
@Mapper
public interface LoginLogMapper {
    /**
     * 插入登录日志
     */
    int insert(LoginLog loginLog);

    /**
     * 根据ID查询登录日志
     */
    LoginLog selectById(Long id);

    /**
     * 查询登录日志列表
     */
    List<LoginLog> selectList(@Param("username") String username,
                             @Param("status") Integer status,
                             @Param("startDate") String startDate,
                             @Param("endDate") String endDate,
                             @Param("offset") Integer offset,
                             @Param("limit") Integer limit);

    /**
     * 查询登录日志总数
     */
    Long selectCount(@Param("username") String username,
                    @Param("status") Integer status,
                    @Param("startDate") String startDate,
                    @Param("endDate") String endDate);
}
