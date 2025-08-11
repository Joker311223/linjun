package com.yin.yin.mapper;

import com.yin.yin.model.Setting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 设置Mapper接口
 */
@Mapper
public interface SettingMapper {
    /**
     * 根据类型查询设置列表
     */
    List<Setting> selectByType(String type);

    /**
     * 根据类型和键查询设置
     */
    Setting selectByTypeAndKey(@Param("type") String type, @Param("key") String key);

    /**
     * 插入设置
     */
    int insert(Setting setting);

    /**
     * 更新设置
     */
    int update(Setting setting);

    /**
     * 删除设置
     */
    int deleteById(Long id);
}
